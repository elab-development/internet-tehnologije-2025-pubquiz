import { Instagram, Facebook } from 'lucide-react';

export default function Footer(){
    return(
        <footer className="bg-neutral-950 text-grey-200 border-t">
            <div className="py-2 flex flex-col justify-center items-center text-center gap-2">
                {/*Drustvene mreze */}
                <div className="flex flex-row gap-5 ">
                    <a href="https://instagram.com" target="_blank">
                        <Instagram size={24}/>
                    </a>

                    <a href="https://facebook.com" target="_blank">
                        <Facebook size={24}/>
                    </a>
                </div>

                <div>
                    <a href="mailto:pubquiz@gmail.com" className="md:pr-4">pubquiz@gmail.com</a>
                </div>
            </div>

        </footer>
    );
}